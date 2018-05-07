import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import {read, listRelated} from './api-media.js'
import Media from './Media'
import RelatedMedia from './RelatedMedia'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  toggle: {
    float: 'right',
    marginRight: '30px',
    marginTop:' 10px'
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
  loadMedia = (mediaId) => {
    read({mediaId: mediaId}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({media: data})
          listRelated({
            mediaId: data._id}).then((data) => {
            if (data.error) {
              console.log(data.error)
            } else {
              this.setState({relatedMedia: data})
            }
          })
      }
    })
  }
  componentDidMount = () => {
    this.loadMedia(this.match.params.mediaId)
  }
  componentWillReceiveProps = (props) => {
    this.loadMedia(props.match.params.mediaId)
  }
  handleChange = (event) => {
   this.setState({ autoPlay: event.target.checked })
  }
  handleAutoplay = (updateMediaControls) => {
    let playList = this.state.relatedMedia
    let playMedia = playList[0]
    if(!this.state.autoPlay || playList.length == 0 )
      return updateMediaControls()

    if(playList.length > 1){
      playList.shift()
      this.setState({media: playMedia, relatedMedia:playList})
    }else{
      listRelated({
          mediaId: playMedia._id}).then((data) => {
            if (data.error) {
             console.log(data.error)
            } else {
             this.setState({media: playMedia, relatedMedia: data})
            }
         })
    }
  }
  render() {
    //render SSR data
    if (this.props.data && this.props.data[0] != null) {
          this.state.media = this.props.data[0]
          this.state.relatedMedia = []
    }

    const nextUrl = this.state.relatedMedia.length > 0
          ? `/media/${this.state.relatedMedia[0]._id}` : ''
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={8} sm={8}>
            <Media media={this.state.media} nextUrl={nextUrl} handleAutoplay={this.handleAutoplay}/>
          </Grid>
          {this.state.relatedMedia.length > 0
            && (<Grid item xs={4} sm={4}>
                    <FormControlLabel className = {classes.toggle}
                        control={
                          <Switch
                            checked={this.state.autoPlay}
                            onChange={this.handleChange}
                            color="primary"
                          />
                        }
                        label={this.state.autoPlay ? 'Autoplay ON':'Autoplay OFF'}
                    />
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
