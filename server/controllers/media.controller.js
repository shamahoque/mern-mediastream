import Media from '../models/media.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

//media streaming
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'
Grid.mongo = mongoose.mongo
let gridfs = null
mongoose.connection.on('connected', () => {
  gridfs = Grid(mongoose.connection.db)
})

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Video could not be uploaded"
        })
      }
      let media = new Media(fields)
      media.postedBy= req.profile
      if(files.video){
        let writestream = gridfs.createWriteStream({_id: media._id})
        fs.createReadStream(files.video.path).pipe(writestream)
      }
      media.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          })
        }
        res.json(result)
      })
    })
}

const mediaByID = (req, res, next, id) => {
  Media.findById(id).populate('postedBy', '_id name').exec((err, media) => {
    if (err || !media)
      return res.status('400').json({
        error: "Media not found"
      })
    req.media = media
    next()
  })
}

const video = (req, res) => {
  gridfs.findOne({
        _id: req.media._id
    }, (err, file) => {
        if (err) {
            return res.status(400).send({
                error: errorHandler.getErrorMessage(err)
            })
        }
        if (!file) {
            return res.status(404).send({
                error: 'No video found'
            })
        }

        if (req.headers['range']) {
            var parts = req.headers['range'].replace(/bytes=/, "").split("-")
            var partialstart = parts[0]
            var partialend = parts[1]

            var start = parseInt(partialstart, 10)
            var end = partialend ? parseInt(partialend, 10) : file.length - 1
            var chunksize = (end - start) + 1

            res.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                'Content-Type': file.contentType
            })

            gridfs.createReadStream({
                _id: file._id,
                range: {
                    startPos: start,
                    endPos: end
                }
            }).pipe(res)
        } else {
            res.header('Content-Length', file.length)
            res.header('Content-Type', file.contentType)

            gridfs.createReadStream({
                _id: file._id
            }).pipe(res)
        }
    })
}

const listPopular = (req, res) => {
  Media.find({}).limit(9)
  .populate('postedBy', '_id name')
  .sort('-views')
  .exec((err, posts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(posts)
  })
}

export default {
  create,
  mediaByID,
  video,
  listPopular
}
