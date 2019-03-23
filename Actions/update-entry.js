/**
 * Prepare the guestbook entry to be persisted
 */
function main(params) {
  if (!params.email || !params.eleccion) {
    return Promise.reject({ error: 'no email or election'});
  }

  return {
    doc: {
        _id: params.id,
       _rev: params.rev,
      createdAt: new Date(),
       nombre: params.nombre,
       email: params.email,
       eleccion: params.eleccion
    }
  };
}

