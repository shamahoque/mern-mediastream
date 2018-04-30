import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card, {CardHeader} from 'material-ui/Card'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import Edit from 'material-ui-icons/Edit'
import Avatar from 'material-ui/Avatar'
import auth from './../auth/auth-helper'
import {Link} from 'react-router-dom'
import ReactPlayer from 'react-player'
import Divider from 'material-ui/Divider'

const styles = theme => ({
  card: {
    padding:'20px'
  },
  header: {
    padding:'0px 16px 16px 12px'
  },
  action: {
    margin: '24px 20px 0px 0px',
    display: 'inline-block',
    fontSize: '1.15em',
    color: theme.palette.secondary.dark
  },
  avatar: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.light
  }
})

class Media extends Component {
  render() {
    const mediaUrl = this.props.media._id
          ? `/api/media/video/${this.props.media._id}`
          : null
    const {classes} = this.props
    const nextUrl = this.props.nextUrl
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
            title={this.props.media.title}
            action={
              <span className={classes.action}>{this.props.media.views + ' views'}</span>
            }
            subheader={this.props.media.genre}
        />
        <ReactPlayer url={mediaUrl} width='100%' height='inherit' style={{maxHeight: '100%'}} controls/>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                {this.props.media.postedBy.name && this.props.media.postedBy.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={this.props.media.postedBy.name}
                          secondary={"Published on " + (new Date(this.props.media.created)).toDateString()}/>
            { auth.isAuthenticated().user
                && auth.isAuthenticated().user._id == this.props.media.postedBy._id
                && (<ListItemSecondaryAction>
                      <Link to={"/media/edit/" + this.props.media._id}>
                        <IconButton aria-label="Edit" color="secondary">
                          <Edit/>
                        </IconButton>
                      </Link>
                    </ListItemSecondaryAction>)
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={this.props.media.description}/>
          </ListItem>
        </List>
      </Card>)
  }
}

Media.propTypes = {
  classes: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired
}

export default withStyles(styles)(Media)
