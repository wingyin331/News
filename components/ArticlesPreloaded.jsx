/* eslint-disable space-before-function-paren */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */

// NOTICE: importing reactn instead of react
import React from 'reactn';

// moment
import moment from 'moment';

// components
import Article from './Article.jsx';

import { Link } from '../routes';

// utility functions
import {
  parseDate
} from '../utilities/app.utilities.js';

export default class ArticlesPreloaded extends React.Component {

  constructor(props) {
    super(props);
    this.getArticles = this.getArticles.bind(this);

  }

  getArticles() {
    const { mode, data, category } = this.props;
    let categoryData = {};
    if (category === 'latest'){
      categoryData = {
        name: "Latest",
        id: 'latest',
        link: ''
      }
    }
    else{
      categoryData = data[0].categories.find(cat => cat.id === category);
    }
    let articles =
      data
        .sort((a, a2) => moment(a2.date).diff(a.date))
        .map(a => parseDate(a))
        .map((s, i) => {
          if (mode === 'text-only' || (mode === 'first-featured' && i !== 0)) {
            return <Article text_only={true} {...s} key={i} />;
          }
          else {
            return <Article text_only={false} {...s} key={i} />;
          }
        });
    
    return { articles, categoryData };
  }

  render() {
    const { mode } = this.props;
    let { articles, categoryData } = this.getArticles();

    let classes = [];

    classes.push(mode);
    var header = "";
    if (categoryData.name === 'Latest') {
      header = <h1>Latest</h1>;
    }
    else {
      header = <Link href={categoryData.link}><a><h1 dangerouslySetInnerHTML={{ __html: categoryData.name }}></h1></a></Link>;
    }

    return (
      <div className={`articles ${categoryData.id}`}>
        {header}
        <div className={classes.join(' ')} >
          {
            articles
          }
        </div>
      </div>
    );
  }
}
