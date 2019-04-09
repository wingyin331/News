import React from 'react';
import Link from 'next/link';

export default class DonateBar extends React.Component {
  render() {
    return (
      <div className='donate-bar'>
        Please support our journalism by <a href='https://form.jotform.com/90963794821166' target="_blank">Donating to The Diamondback.</a>
      </div>
    )
  }
}