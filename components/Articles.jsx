/* eslint-disable space-before-function-paren */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */

// NOTICE: importing reactn instead of react
import React from 'reactn';

// moment
import moment from 'moment';

// components
import Article from '../components/Article.jsx';
import Loading from '../components/Loading.jsx';

import { Link } from '../routes';

// utility functions
import {
  handleError, request, parseDate
} from '../utilities/app.utilities.js';

export default class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = { articles: [], loaded: false, category: null };
  }

  async componentDidMount() {
    const { category, max, mode } = this.props;

    try {
      // request category articles
      var articles_data = null;
      var categories_data = null;
      if (category === 'latest'){
        articles_data = await request(`/articles?preview=true&per_page=${max}`);
        categories_data = {
          name: 'Latest',
          id: 'latest'
        };
      }
      else{
        articles_data = await request(`/articles?category=${category}&preview=true&per_page=${max}`);
        categories_data = await request(`/category/${category}`);  
      }

      /*
       * NOTICE: articles_data is an array contaning article block components,
       * NOT the article page components. below we sort the articles by date,
       * and create Article (block) components
       */
      articles_data =
        articles_data
          .sort((a, a2) => moment(a2.date).diff(a.date))
          .map(a => parseDate(a))
          .map((s, i) => {
            if (mode === 'text-only' || (mode === 'first-featured' && i !== 0)){
              return <Article text_only={true} {...s} key={i} />;
            }
            else{
              return <Article text_only={false} {...s} key={i} />;
            }
          });

      this.setState({ articles: articles_data, loaded: true, category: categories_data });

    } catch (error) {
      handleError(error.message);
    }
  }

  render() {
    const { articles, category, loaded } = this.state;
    const { mode } = this.props;

    let classes = [];

    if (loaded) {
      classes.push(mode);
    } else {
      return (<Loading />);
    }

    var header = "";
    if (category.name === 'Latest'){
      header = <h1>Latest</h1>;
    }
    else{
      header = <Link href={category.link}><a><h1 dangerouslySetInnerHTML={{ __html: category.name }}></h1></a></Link>;
    }
    
    return (
      <div className={`articles ${category.id}`}>
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
