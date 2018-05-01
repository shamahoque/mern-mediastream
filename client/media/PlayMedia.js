import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import {read, listRelated} from './api-media.js'
import Media from './Media'
import RelatedMedia from './RelatedMedia'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  }
})

class PlayMedia extends Component {
  constructor({match}) {
    super()
    this.state = {
      media: {postedBy: {}},
      relatedMedia: [],
      autoPlay: false
    }
    this.match = match
  }
  loadMedia = (mediaId, autoplay) => {
    read({mediaId: mediaId}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({media: data})
        if(!autoplay){
          listRelated({
            mediaId: data._id}).then((data) => {
            if (data.error) {
              console.log(data.error)
            } else {
              this.setState({relatedMedia: data})
            }
          })
        }
      }
    })
  }
  componentDidMount = () => {
    this.loadMedia(this.match.params.mediaId, false)
  }
  componentWillReceiveProps = (props) => {
    this.loadMedia(props.match.params.mediaId, false)
  }
  render() {
    const nextUrl = this.state.relatedMedia.length > 0
          ? `/media/${this.state.relatedMedia[0]._id}` : ''
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={8} sm={8}>
            <Media media={this.state.media} nextUrl={nextUrl}/>
          </Grid>
          {this.state.relatedMedia.length > 0
            && (<Grid item xs={4} sm={4}>
                  <RelatedMedia media={this.state.relatedMedia}/>
                </Grid>)
           }
        </Grid>
      </div>)
  }
}

PlayMedia.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PlayMedia)
