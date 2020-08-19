var express = require('express');
var router = express.Router();
// var moment = require('moment');


/* GET home page. */
module.exports = (pool) => {

  router.get('/', function (req, res, next) {
    let isSearch = false;
    let searchFinal = ""
    let dataSearch = []

    if (req.query.id) {
      dataSearch.push(`id = ${req.query.id}`)
      isSearch = true
    }
    if (req.query.str) {
      dataSearch.push(`string ilike '%${req.query.str}%'`)
      isSearch = true
    }
    if (req.query.int) {
      dataSearch.push(`integer = '${req.query.int}'`)
      isSearch = true
    }
    if (req.query.startdate && req.query.enddate) {
      dataSearch.push(`date BETWEEN '${req.query.startdate}' AND '${req.query.enddate}'`)
      isSearch = true
    }
    if (req.query.float) {
      dataSearch.push(`float = '${req.query.float}'`)
      isSearch = true
    }
    if (req.query.bool) {
      dataSearch.push(`boolean = '${req.query.bool}'`)
      isSearch = true
    }

    if (isSearch) {
      searchFinal += ` WHERE ${dataSearch.join(' AND ')}`
    }
    console.log(searchFinal);

    const page = Number(req.query.page) || 1
    const limit = 5
    const offset = (page - 1) * limit

    let sql = `SELECT COUNT (id) as total FROM siswa21 ${searchFinal}`
    pool.query(sql, (err, data) => {
      if (err) {
        return res.json(err)
      } else if (data.rows == 0) {
        return res.send(`Data tidak ditemukan`)
      }
      const total = Number(data.rows[0].total)
      const pages = Math.ceil(total / limit)
      console.log('total', total);

      let sql = `select * from siswa21 ${searchFinal} ORDER BY id limit $1 offset $2` //jquery harus pakai $(dollar)
      pool.query(sql, [limit, offset], (err, data) => {
        if (err) {
          return res.json(err)
        } else if (data.rows == 0) {
          return res.send(`Data tidak ditemukan`)
        } else {
          res.json({
            data: data.rows,
            pages,
            page
          })
        }
      })
    })
  })


  router.get('/', function (req, res, next) {
    pool.query('SELECT * FROM siswa21 ORDER BY id DESC', (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rows)
    })
  });

  router.post('/', function (req, res, next) {
    pool.query('INSERT INTO siswa21(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, JSON.parse(req.body.boolean)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rows)
    })
  });

  router.put('/:id', function (req, res, next) {
    console.log(req.params)
    console.log(req.body)
    console.log("wkwkkw")
    pool.query('UPDATE siswa21 SET string=$2, integer=$3, float=$4, date=$5, boolean=$6 WHERE id=$1', [Number(req.params.id), req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, JSON.parse(req.body.boolean)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })
  });

  router.delete('/:id', function (req, res, next) {
    pool.query('DELETE FROM siswa21 WHERE id=$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })
  });
  router.get('/:id', function (req, res) {
    let id = req.params.id
    pool.query(`SELECT * FROM siswa21 WHERE id = ${id}`, (err, data) => {
      if (err) return res.json(err)
      res.json(data.rows)
    })
  });



  return router;
}
