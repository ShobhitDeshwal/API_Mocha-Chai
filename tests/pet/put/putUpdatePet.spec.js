import request from "supertest";
import {expect} from "chai";
import config from 'config' //import 'dotenv/config';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('testData/petData.json'),'utf8');
const baseUrl = config.get('baseUrl'); //process.env.API_BASE_URL 

describe("PUT requests to update the details", () => {
  it("update with put", async () => {
    const res = await request(baseUrl)
      .put(data.endPoints.post_addANewPet)
      .send(data.petpayload)
      .expect(200);       

    const resp = await request(baseUrl).get('/pet/10');
    expect(resp.body.name).to.be.equal('rex');
  });

  it("update with incorrect node put", async () => {
    const res = await request(baseUrl)
      .put("/pet/10")
      .send(data.petpayload)
      .expect(405);

    expect(res.body.message).that.matches(/Method not allowed/i);

    
  });
});
