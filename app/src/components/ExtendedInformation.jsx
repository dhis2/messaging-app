import React, { Component } from 'react';

import Subheader from 'material-ui/Subheader/Subheader';

const ExtendedInformation = ({ messageConversation, gridArea }) => (
  <div style={{
    gridArea: gridArea,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)'
  }}>
    <ExtendedChoiceLabel gridArea={'1/1'} title={'Status'} label={messageConversation.status} />
    <ExtendedChoiceLabel gridArea={'1/2'} title={'Priority'} label={messageConversation.priority} />
    <ExtendedChoiceLabel gridArea={'1/3'} title={'Assignee'} label={messageConversation.assignee ? messageConversation.assignee.displayName : undefined} />
  </div>
)

const ExtendedChoiceLabel = ({ gridArea, title, label }) => {
  return (
    <div style={{ gridArea: gridArea }}>
      <Subheader style={{ height: '32px' }}> {title} </Subheader>
      <Subheader style={{ color: 'black', height: '32px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} > {label ? label : 'None'} </Subheader>
    </div>
  )
}

export default ExtendedInformation;
