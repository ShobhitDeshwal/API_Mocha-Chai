import request from "supertest";
import { expect } from "chai";
import config from 'config' //import 'dotenv/config';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('testData/petData.json'),'utf8');

const baseUrl = config.get('baseUrl'); //process.env.API_BASE_URL 

describe("Delete a pet", () => {
  it("deleted pet by id", async () => {
    const res = await request(baseUrl)
      .delete(data.endPoints.delete_deleteAPet)
      .set("Accept", "*/*")
      .set("content-type", "application/json")
      .parse((res, callback) => {
        //Custom parser to handle plain text
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => callback(null, data));
      })      
    expect(res.status).to.be.equal(200);
    expect(res.body).to.equal("Pet deleted");   
  });

  it("deleted pet by incorrect id", async () => {
    const res = await request(baseUrl)
      .delete("/pet/1111111111111111111111111")
      .set("Content-type", "text/plain")
      .expect(400);

    expect(res.status).to.be.equal(400);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.contain('Input error');
  });

  it("deleted pet by incorrect request", async () => {
    const res = await request(baseUrl)
      .delete("/pet/")
      .set("Content-type", "text/plain")
      .expect(405);

    expect(res.status).to.be.equal(405);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.contain('Method Not Allowed');
  });
});
