import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import GridList, {GridListTile, GridListTileBar } from 'material-ui/GridList'
import {Link} from 'react-router-dom'
import ReactPlayer from 'react-player'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: '8px 16px'
  },
  gridList: {
    width: '100%',
    minHeight: 180,
    padding: '0px 0 10px'
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    width: '100%'
  },
  tile: {
    textAlign: 'center',
    maxHeight: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left',
    height: '55px'
  },
  tileTitle: {
    fontSize:'1.1em',
    marginBottom:'5px',
    color:'rgb(193, 173, 144)',
    display:"block"
  },
  tileGenre: {
    float: 'right',
    color:'rgb(193, 182, 164)',
    marginRight: '8px'
  }
})

class MediaList extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={3}>
          {this.props.media.map((tile, i) => (
            <GridListTile key={i} className={classes.tile}>
              <Link to={"/media/"+tile._id}>
                <ReactPlayer url={'/api/media/video/'+tile._id} width='100%' height='inherit' style={{maxHeight: '100%'}}/>
              </Link>
              <GridListTileBar className={classes.tileBar}
                title={<Link to={"/media/"+tile._id} className={classes.tileTitle}> {tile.title} </Link>}
                subtitle={<span>
                            <span>{tile.views} views</span>
                            <span className={classes.tileGenre}>
                              <em>{tile.genre}</em>
                            </span>
                          </span>}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>)
  }
}
MediaList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MediaList)
