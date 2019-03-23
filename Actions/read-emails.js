const md5 = require('spark-md5');

function main(params) {
  return {
    entries: params.rows.map((row) => { return {
        id: row.doc._id,
        _rev: row.doc._rev,
      email: row.doc.email
    }})
  };
}

