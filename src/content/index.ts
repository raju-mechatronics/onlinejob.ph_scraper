import { write } from 'csv-reader';
import $, { ajax } from 'jquery';
import { JobType } from '../dataTypes';

const nextBtn = $('[rel="next"]');
const jobPosts = $('.jobpost-cat-box').each(function (index, element) {});

async function scrape() {
  const nextBtn = $('[rel="next"]');
  const jobPosts = $('.jobpost-cat-box');
  const jobArr: JobType[] = [];
  for (let i = 0; i < jobPosts.length; i++) {
    const element = jobPosts[i];
    const title = $(element).find('[title]').html().split('<span')[0].trim();
    const [writer, date] = $(element).find('a > p.fs-13.mb-0[data-temp]').text().split('•');
    const rate = $(element).find('dd.col').text();
    const jobURL = $(element).find('a').attr('href');
    const res = await fetch(jobURL as string);
    const resText = await res.text();
    const description = $(resText).find('#job-description').text();
    jobArr.push({
      date: date,
      description: description,
      rate: rate,
      title: title,
      writer: writer,
      url: jobURL ? jobURL : '',
    });

    console.log(jobArr);
  }
}

scrape();