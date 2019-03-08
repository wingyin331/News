// react
import * as React from 'react';
import { Link } from '../routes';
import Head from 'next/head';
import Parser from 'html-react-parser';

import ErrorPage from './ErrorPage.jsx';

import $ from 'jquery';

// components
import RelatedContent from '../components/RelatedContent';
import Advertisement from '../components/Advertisement';
import SponsoredLinks from '../components/SponsoredLinks';

import {
  request, parseDate, loadImage, processArticleBody, loadDynamicArticleContent, chooseArticleDates
} from '../utilities/app.utilities.js';


/* eslint-disable space-before-function-paren */
/* eslint-disable camelcase */

export default class ArticlePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { scriptjsLoaderEnabled: false };
  }

  static async getInitialProps({ query }) {
    let article_data = null;
    try {
      article_data = await request(`/articles/${query.slug}`);
      article_data = parseDate(article_data);
    } catch (error) {
      console.log(error);
      return {
        article: null
      };
    }

    const disqusShortname = 'the-diamondback';
    const disqusConfig = {
      url: article_data.url,
      identifier: article_data.id,
      title: article_data.title,
    };

    return {
      article: article_data,
      disqus: {
        disqusShortname,
        disqusConfig
      }
    };
  }

  async componentDidUpdate() {
    if (document.getElementById('article-text') !== null) {
      processArticleBody(document.getElementById('article-text'));
    }
  }

  componentDidMount() {
    this.setState({ scriptjsLoaderEnabled: true });
  }

  generateCategories(categoryList) {
    return categoryList.map((cat) => (
      <Link href={cat.link} key={cat.id}><a>{Parser(cat.name)}</a></Link>));
  }

  render() {
    const { article, disqus } = this.props;
    if (!article) {
      return <ErrorPage />;
    }

    let featuredImage = "";
    if (article.featured_image) {
      featuredImage = <React.Fragment>
        <div className='image-area'>
          <img
            alt='Article Image'
            className='article-image'
            id={"image-" + article.id} src={article.featured_image.article}
            onLoad={() => (loadImage("image-" + article.id))} />
        </div>
        <span className='article-caption' dangerouslySetInnerHTML={{ __html: article.featured_image.caption }}></span>
      </React.Fragment>
    }
    //injects article ads after window loads
    let article_body = <div id='article-text-before' className='article-text before-js' dangerouslySetInnerHTML={{ __html: article.content.rendered }}></div>;
    let article_body_ads = "";
    if (this.state.scriptjsLoaderEnabled) {
      $("#article-text-before").hide();
      article_body_ads = <div id='article-text' className='article-text after-js'>
        {loadDynamicArticleContent(article.content.rendered)}
      </div>;
    }

    let description = article.excerpt.rendered;
    description = description.replace('<p>', '');
    description = description.replace('</p>', '');
    description = description.replace('\n', '');

    return (
      <React.Fragment>
        <Head>
          <title>{article.title + " - The Diamondback  "}</title>

          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content={description} />
          <meta name="author" content={article.author.name} />
          <meta property="og:title" content={article.title + " - The Diamondback  "} />
          <meta property="og:description" content={description} />
          {featuredImage ?
            <meta property="og:image" content={article.featured_image.preview} />
            :
            <meta property="og:image" content="/static/images/the-diamondback-logo.svg" />
          }
          <meta name="twitter:card" content="summary_large_image" />

          <script async src="https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5c418704770faa57"></script>
        </Head>
        <main className={`page article-page${article.categories.find(cat => cat.id === 'sponsored') ? ' sponsored-page' : ''}`}>
          <div className='container-narrow flex'>
            <div className='left-rail'>
              <div className='category'>{this.generateCategories(article.categories)}</div>
              <h1 dangerouslySetInnerHTML={{ __html: article.title }}></h1>
              <div className='details'>
                <span className='accent author'><Link href={article.author.link}><a>{article.author.name}</a></Link></span>
                <span className='dot'>·</span>
                {
                  article.author.user_twitter ?
                    <React.Fragment>
                      <span className='accent author twitter-link'><a href={`https://twitter.com/${article.author.user_twitter}`}>{`@${article.author.user_twitter}`}</a></span>
                      <span className='dot'>·</span>
                    </React.Fragment>
                    : ''
                }
                <span
                  dangerouslySetInnerHTML={{ __html: article.date.ago }}
                />
              </div>
              <div className="addthis_inline_share_toolbox"></div>
              {featuredImage}
              {article_body}
              {article_body_ads}
            </div>
            <div className='right-rail'>
              <br />
              <br />
              <Advertisement path='300x250_Banner_B' size={[300, 250]} mode="desktop" />
              <br />
              <Advertisement path='300x600_Banner_C' size={[300, 600]} mode="desktop" />
              <br />
              <SponsoredLinks />
            </div>
          </div>
          <div className='container-narrow'>
            <RelatedContent categories={article.categories} story_id={article.id}></RelatedContent>
          </div>
        </main>
      </React.Fragment>
    );
  }
}
