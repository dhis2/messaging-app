import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { cardStyles } from '../styles/style'
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import theme from '../styles/theme';

class ReplyCard extends Component {
  render() {
    return (
      <Card
        style={cardStyles.cardItem}
      >
        <CardHeader
          title={'REPLY'}
          actAsExpander
          showExpandableButton
        >
        </CardHeader>

        <CardText expandable>
          <SuggestionField label={'To'} messageConversation={this.props.messageConversation} />
          <TextField
            key={'textField'}
            rows={5}
            underlineShow={false}
            defaultValue={''}
            multiLine
            fullWidth
            ref={(input) => setTimeout(() => { 
              input && input.focus() }, 100)
            }
          />
        </CardText>
      </Card>
    )
  }
}

export default ReplyCard;