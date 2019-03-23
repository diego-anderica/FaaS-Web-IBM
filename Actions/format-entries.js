const md5 = require('spark-md5');

function main(params) {
  return {
    entries: params.rows.map((row) => { return {
      eleccion: row.doc.eleccion
    }})
  };
}

