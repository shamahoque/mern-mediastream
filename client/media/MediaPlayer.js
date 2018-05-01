import React, {Component} from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { LinearProgress } from 'material-ui/Progress'
import Input from 'material-ui/Input'

const styles = theme => ({
  flex:{
    display:'flex'
  },
  primaryDashed: {
    background: 'none',
    backgroundColor: theme.palette.secondary.main
  },
  primaryColor: {
    backgroundColor: '#6969694f'
  },
  dashed: {
    animation: 'none'
  },
  controls:{
    position: 'relative',
    backgroundColor: '#ababab52'
  },
  rangeRoot: {
    position: 'absolute',
    width: '100%',
    top: '-7px',
    zIndex: '3456',
    '-webkit-appearance': 'none',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  videoError: {
    width: '100%',
    textAlign: 'center',
    color: theme.palette.primary.light
  }
})

class MediaPlayer extends Component {
  state = {
        playing: true,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        ended:false,
        playbackRate: 1.0,
        loop: false,
        fullscreen: false,
        videoError: false
  }
  componentDidMount = () => {
    if (screenfull.enabled) {
      screenfull.on('change', () => {
        let fullscreen = screenfull.isFullscreen ? true : false
        this.setState({fullscreen: fullscreen})
      })
    }
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  playPause = () => {
     this.setState({ playing: !this.state.playing })
  }
  onLoop = () => {
       this.setState({ loop: !this.state.loop })
  }
  onProgress = progress => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState({played: progress.played, loaded: progress.loaded})
    }
  }
  onClickFullscreen = () => {
   screenfull.request(findDOMNode(this.player))
  }
  onEnded = () => {
    if(this.state.loop){
      this.setState({ playing: true})
    } else{
      this.props.handleAutoplay(()=>{this.setState({ ended: true, playing: false })})
    }
  }
  onDuration = (duration) => {
    this.setState({ duration })
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value), ended: parseFloat(e.target.value) >= 1 })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  ref = player => {
      this.player = player
  }
  format = (seconds) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    let mm = date.getUTCMinutes()
    const ss = ('0' + date.getUTCSeconds()).slice(-2)
    if (hh) {
      mm = ('0' + date.getUTCMinutes()).slice(-2)
      return `${hh}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
  }
  videoError = e => {
    this.setState({videoError: true})
  }
  render() {
    const {classes} = this.props
    const { playing, ended, volume, muted, loop, played, loaded, duration, playbackRate, fullscreen, videoError } = this.state
    return (<div>
        <div className={classes.flex}>
          {videoError && <p className={classes.videoError}>Video Error. Try again later.</p>}
          <ReactPlayer
            ref={this.ref}
              width={fullscreen ? '100%':'inherit'}
              height={fullscreen ? '100%':'inherit'}
              style={fullscreen ? {position:'relative'} : {maxHeight: '500px'}}
              config={{ attributes: { style: { height: '100%', width: '100%'} } }}
              url={this.props.srcUrl}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onEnded={this.onEnded}
              onError={this.videoError}
              onProgress={this.onProgress}
              onDuration={this.onDuration}/>
            <br/>
        </div>
        <div className={classes.controls}>
          <LinearProgress color="primary" variant="buffer" value={played*100} valueBuffer={loaded*100} style={{width: '100%'}} classes={{
                colorPrimary: classes.primaryColor,
                dashedColorPrimary : classes.primaryDashed,
                dashed: classes.dashed
          }}/>
          <input type="range" min={0} max={1}
                  value={played} step='any'
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                  className={classes.rangeRoot}/>

          <IconButton color="primary" onClick={this.playPause}>
            <Icon>{playing ? 'pause': (ended ? 'replay' : 'play_arrow')}</Icon>
          </IconButton>
          <IconButton disabled={!this.props.nextUrl} color="primary">
            <Link to={this.props.nextUrl} style={{color: 'inherit'}}>
              <Icon>skip_next</Icon>
            </Link>
          </IconButton>
          <IconButton color="primary" onClick={this.toggleMuted}>
            <Icon>{volume > 0 && !muted && 'volume_up' || muted && 'volume_off' || volume==0 && 'volume_mute'}</Icon>
          </IconButton>
          <input type="range" min={0} max={1} step='any' value={muted? 0 : volume} onChange={this.setVolume} style={{verticalAlign: 'middle'}}/>
          <IconButton color={loop? 'primary' : 'default'} onClick={this.onLoop}>
            <Icon>loop</Icon>
          </IconButton>
          <IconButton color="primary" onClick={this.onClickFullscreen}>
            <Icon>fullscreen</Icon>
          </IconButton>
          <span style={{float: 'right', padding: '10px', color: '#b83423'}}>
            <time dateTime={`P${Math.round(duration * played)}S`}>
              {this.format(duration * played)}
            </time> / <time dateTime={`P${Math.round(duration)}S`}>
                          {this.format(duration)}
                      </time>
          </span>
        </div>
      </div>
    )
  }
}

MediaPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  srcUrl: PropTypes.string,
  nextUrl: PropTypes.string,
  handleAutoplay: PropTypes.func.isRequired
}

export default withStyles(styles)(MediaPlayer)
