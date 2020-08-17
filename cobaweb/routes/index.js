var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (pool) => {
  router.get('/', function (req, res, next) {
    pool.query('SELECT * FROM siswa21', (err, data) => {
      if(err) return res.status(500).json({err})
      res.json(data.rows)
    })
  });

  router.post('/', function (req, res, next) {
    pool.query('INSERT INTO siswa21(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, JSON.parse(req.body.boolean)], (err, data) => {
      if(err) return res.status(500).json({err})
      res.json(data.rows)
    })
  });

  router.put('/:id', function (req, res, next) {
    pool.query('UPDATE siswa21 SET string=$1, integer=$2, float=$3, date=$4, boolean=$5 WHERE id=$6', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, JSON.parse(req.body.boolean), Number(req.params.id)], (err, data) => {
      if(err) return res.status(500).json({err})
      res.json(data.rowCount)
    })
  });

  router.delete('/:id', function (req, res, next) {
    pool.query('DELETE FROM siswa21 WHERE id=$1', [Number(req.params.id)], (err, data) => {
      if(err) return res.status(500).json({err})
      res.json(data.rowCount)
    })
  });

  

  return router;
}
