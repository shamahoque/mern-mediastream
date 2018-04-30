import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import MediaList from '../media/MediaList'
import {listPopular} from '../media/api-media.js'

const styles = theme => ({
  card: {
    margin: `${theme.spacing.unit * 5}px 30px`
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px 0px`,
    color: theme.palette.text.secondary,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})

class Home extends Component {
  state={
    media: []
  }

  componentDidMount = () => {
    listPopular().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({media: data})
      }
    })
  }

  render() {
    const {classes} = this.props
    return (
      <Card className={classes.card}>
        <Typography type="headline" component="h2" className={classes.title}>
          Popular Videos
        </Typography>
          <MediaList media={this.state.media}/>
      </Card>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
