'use strict';

const OMBMemo = require('../lib/scrapers/OMBMemo');
const PresidentialAction = require('../lib/scrapers/PresidentialAction');
const { Document } = require('../models');
const { Op } = require('sequelize');

const ombmemo = new OMBMemo();
const presaction = new PresidentialAction();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    async function addDate(service) {
      console.log(`Adding date for ${service.name}`);

      let items = await service.get();

      for(let i = 0; i < items.length; i++) {
        let item = items[i];

        if(item.posted) {
          let result = await Document.update({posted: item.posted},
          {where: {
            url: item.url,
            type: service.name,
            posted: {[Op.eq]: null}
          }});

          if(result[0]) {
            console.log(`Updated "${item.name}" (${result[0]} records)`);
          }
        }
      }

      let docs = await Document.findAll({where: {
        posted: {[Op.eq]: null},
        type: service.name
      }});

      for(let i = 0; i < docs.length; i++) {
        console.log(`Couldn't set date for "${docs[i].name}" - ${docs[i].url}`);
      }

      console.log('');
      console.log('==========================================');
      console.log('');
    }

    await addDate(presaction);
    await addDate(ombmemo);


    console.log('Running hotfix queries to update missing dates.');

    /* Manual queries */

    // Delete this moved url if it exists.
    await Document.destroy({where: {
      url: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2021/01/20/executive-order-ethic-commitments-by-executive-branch-personnel/'
    }});

    // "Fed 2, 2017" :)
    await Document.update({posted: '2017-02-02'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/briefing-room/presidential-actions/related-omb-material/eo_iterim_guidance_reducing_regulations_controlling_regulatory_costs.pdf'
    }});

    await Document.update({posted: '2014-07-18'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2014/forecast-of-contract-support-for-it_program-activities-fy16_-_fy17.xls'
    }});

    await Document.update({posted: '2012-05-18'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2012/m-12-13-attachment.pdf'
    }});

    await Document.update({posted: '2010-04-21'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2010/ACORN_Second_Circuit_Order.pdf'
    }});

    await Document.update({posted: '2009-06-22'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2009/m09-21-supp1.pdf'
    }});

    await Document.update({posted: '2009-06-22'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2009/m09-21-supp2.pdf'
    }});

    await Document.update({posted: '2008-08-25'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2008/audit_bulletin_2007_final_amended_v2_clean.pdf'
    }});

    await Document.update({posted: '2004-10-01'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2005/m05-01_worksheet.xls'
    }});

    await Document.update({posted: '2004-08-30'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2004/m04-25_template.xls'
    }});

    await Document.update({posted: '2006-08-10'}, {where: {
      url: 'https://www.whitehouse.gov/wp-content/uploads/2017/11/a123_appx-c.pdf'
    }});

    await Document.update({posted: '2006-08-08'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2006/m06-22.xls'
    }});

    await Document.update({posted: '2007-09-04'}, {where: {
      url: 'https://www.whitehouse.gov/wp-content/uploads/2017/11/b07-04.pdf'
    }});

    await Document.update({posted: '2006-02-17'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2006/m06-06_att.doc'
    }});

    await Document.update({posted: '2005-10-01'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2006/m06-01_fy05_647_sheets.xls'
    }});

    await Document.update({posted: '2005-08-23'}, {where: {
      url: 'https://www.whitehouse.gov/wp-content/uploads/2017/11/a136_rev_2005.pdf'
    }});

    await Document.update({posted: '2018-04-09'}, {where: {
      url: 'https://www.whitehouse.gov/wp-content/uploads/2018/04/MOU-One-Federal-Decision-m-18-13-Part-2.pdf'
    }});

    await Document.update({posted: '2017-05-08'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2017/final_draft_list_of_agencies_with_current_waivers_from_eo_13777.pdf'
    }});

    await Document.update({posted: '2015-02-26'}, {where: {
      url: 'https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2015/m-15-06.pdf'
    }});

    console.log('done.');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
