import React from 'react'

import { request } from '../utilities/app.utilities'

export default class SponsoredLinks extends React.Component {
  state = ({ content: null })

  async componentDidMount() {
    try {
      const sponsoredContent = await request('/pages/sponsored-content')
      this.setState({ content: sponsoredContent.content.rendered })
    } catch (e) {
      console.error('Error getting Sponsored Content:', err.message, err)
      this.setState({ content: null })
    }
  }

  render() {
    const { content } = this.state

    if (!content) return ''

    return (
      <div className='sponsored-links'>
        <h2>Sponsored Links</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }
}
