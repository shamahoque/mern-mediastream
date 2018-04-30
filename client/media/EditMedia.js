import React, {Component} from 'react'
import auth from './../auth/auth-helper'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import FileUpload from 'material-ui-icons/FileUpload'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {read, update} from './api-media.js'
import {Redirect} from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  input: {
  display: 'none'
},
filename:{
  marginLeft:'10px'
}
})

class EditMedia extends Component {
  constructor({match}) {
    super()
    this.state = {
      media: {title: '', description:'', genre:''},
      redirect: false,
      error: '',
    }
    this.match = match
  }
  componentDidMount = () => {
    read({mediaId: this.match.params.mediaId}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({media: data})
      }
    })
  }

  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    update({
      mediaId: this.state.media._id
    }, {
      t: jwt.token
    }, this.state.media).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({error: '', redirect: true, media: data})
      }
    })
  }

  handleChange = name => event => {
    let updatedMedia = this.state.media
    updatedMedia[name] = event.target.value
    this.setState({media: updatedMedia})
  }
  render() {
    const {classes} = this.props
    if (this.state.redirect) {
      return (<Redirect to={'/media/' + this.state.media._id}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h1" className={classes.title}>
            Edit Video Details
          </Typography>
          <TextField id="title" label="Title" className={classes.textField} value={this.state.media.title} onChange={this.handleChange('title')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={this.state.media.description}
            onChange={this.handleChange('description')}
            className={classes.textField}
            margin="normal"
          /><br/>
          <TextField id="genre" label="Genre" className={classes.textField} value={this.state.media.genre} onChange={this.handleChange('genre')} margin="normal"/><br/>
          <br/> {
                  this.state.error &&
                  (<Typography component="p" color="error">
                    <Icon color="error" className={classes.error}>error</Icon>
                    {this.state.error}
                  </Typography>)
                }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
  }
}

EditMedia.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditMedia)
