/**
 * Web application
 */
const apiUrl = 'https://1e966fab.eu-gb.apiconnect.appdomain.cloud/guestbook';
const webvotacion = {
  // retrieve the existing guestbook entries
  getVotaciones() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/votos`,
      dataType: 'json'
    });
  },

  checkEmail() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/checkEmails`,
      dataType: 'json'
    });
  },

  // add a single guestbood entry
  nuevoVoto(nombre, email, eleccion) {
    console.log('Enviando', nombre, email, eleccion)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/nuevoVoto`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        nombre,
        email,
        eleccion,
      }),
      dataType: 'json',
    });
  },

  actualizarVoto(id, rev, nombre, email, eleccion) {
    console.log('Enviando', id, rev, eleccion)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/actualizarVoto`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        id,
        rev,
        nombre,
        email,
        eleccion,
      }),
      dataType: 'json',
    });
  }
};

(function() {
  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Cargando resultados...');
    webvotacion.getVotaciones().done(function(result) {
      if (!result.entries) {
        return;
      }

      if (result.entries.length == 0) {
        alert("No hay votaciones aún. Vuelve a intentarlo más tarde o sé la primera persona en votar.");
        return;
      }

      calcularResultados(result.entries);

    }).error(function(error) {
      alert("Se ha producido un error al contactar con la base de datos.");
      console.log(error);
    });
  }

  function calcularResultados(votaciones) {
    var votosTotales = votaciones.length;
    var votosLunes = 0;
    var votosMartes = 0;
    var votosJueves = 0;

    var prcLunes = 0;
    var prcMartes = 0;
    var prcJueves = 0;

    for (i = 0; i < votosTotales; i++) {
      if (votaciones[i].eleccion == "lunes"){
        votosLunes++;
      } else if (votaciones[i].eleccion == "martes"){
        votosMartes++;
      } else if (votaciones[i].eleccion == "jueves"){
        votosJueves++;
      }
    }

    prcLunes = ((votosLunes * 100) / votosTotales).toFixed(2);
    prcMartes = ((votosMartes * 100) / votosTotales).toFixed(2);
    prcJueves = ((votosJueves * 100) / votosTotales).toFixed(2);

    $("#prgLunes").css("width", prcLunes + "%").attr("aria-valuenow", prcLunes).text(prcLunes + "%");
    $("#prgMartes").css("width", prcMartes + "%").attr("aria-valuenow", prcMartes).text(prcMartes + "%");
    $("#prgJueves").css("width", prcJueves + "%").attr("aria-valuenow", prcJueves).text(prcJueves + "%");

  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#frmVoto', function(e) {
    e.preventDefault();
    var id = "";
    var rev = "";

    if (comprobarFormulario()){
      
      webvotacion.checkEmail().done(function(result) {
        var existe = false;

        if (!result.entries) {
          return;
        }

        if (result.entries.length > 0) {
          for (i = 0; i < result.entries.length; i++) {
            if ($('#email').val().trim() == result.entries[0].email) {
              id = result.entries[i].id;
              rev = result.entries[i]._rev;
              existe = true;
              break;
            }
          }
        }

        if (existe) {
          if (confirm("Si continúas, tu voto anterior será reemplazado por el nuevo. ¿Deseas continuar?")) {
            webvotacion.actualizarVoto(
              id,
              rev,
              $('#nombre').val().trim(),
              $('#email').val().trim(),
              $('input[name=eleccion]:checked').val()
            ).done(function(result) {
              alert("Tu voto ha sido cambiado correctamente");
              // reload entries
              loadEntries();
            }).error(function(error) {
              console.log(error);
            });
          }
        } else {
          webvotacion.nuevoVoto(            
            $('#nombre').val().trim(),
            $('#email').val().trim(),
            $('input[name=eleccion]:checked').val()
          ).done(function(result) {
            alert("Tu voto se ha registrado correctamente");
            // reload entries
            loadEntries();
          }).error(function(error) {
            alert("Se ha producido un error al contactar con la base de datos.");
            console.log(error);
          });
        }

      }).error(function(error) {
        alert("Se ha producido un error al contactar con la base de datos.");
      });

    }

  });

  function comprobarFormulario() {
    var nombre = $('#nombre').val().trim();
    var email = $('#email').val().trim();
    var diaElegido = $('input[name=eleccion]:checked').val();
    var continuar = false;

    if (nombre == "") {
      alert("Escribe un nombre");
      return continuar;
    }

    if (email == "") {
      alert("Escribe un email");
      return continuar;
    } else if (!email.includes("@")) {
      alert("Escribe una dirección de correo válida");
      return continuar;
    }

    if (diaElegido == undefined) {
      alert("Elige un día entre los disponibles");
      return continuar;
    }

    return !continuar;
    
  }

  $(document).ready(function() {
    loadEntries();
  });
})();
