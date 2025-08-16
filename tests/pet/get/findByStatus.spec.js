import request from "supertest";
import { expect } from "chai";
import config from 'config'  //import 'dotenv/config';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('testData/petData.json', 'utf8'));
const baseUrl = config.get('baseUrl'); // process.env.API_BASE_URL 

describe("PET GET API Tests", () => {
  it("Get pet by status avaialable", async () => {
    const response = await request(baseUrl)
      .get(data.endPoints.get_findByStatus)        
      .query({ status: data.status.Available })
      .set("Accept", "application/json");

    // Validate response status and body
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.length.greaterThan(0);
    expect(response.headers['content-type']).to.include('application/json');  
    expect(response.headers).to.have.property('server'); 
   
   //Body structure validation
    expect(response.body[0]).to.have.property('id'); 
    expect(response.body[0]).to.have.property('name'); 
    expect(response.body[0]).to.have.property('category'); 
    expect(response.body[0]).to.have.property('photoUrls'); 

    // Validate that the first pet has a valid ID and name
    expect(response.body[0].id).to.be.a('number').and.be.greaterThan(0);
    expect(response.body[0].name).to.be.a('string').and.not.be.empty;
    expect(response.body[0].category).to.be.an('object');
    //expect(response.body[0].photoUrls).to.be.an('array').that.is.not.empty;

    //advanced validation
    response.body.forEach(item => {
      expect(item).to.have.property('id');
      });
    // Validate data consistency
    const ids = response.body.map(item => item.id);
      expect([...new Set(ids)]).to.have.lengthOf(ids.length); // No duplicates
     });

  it("Get pet by status pending", async () => {
    const response = await request(baseUrl)
      .get(data.endPoints.get_findByStatus)
      .query({ status: data.status.Pending })
      .set("Accept", "application/json");

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.an('array');
  });

  it("Get pet by status sold ", async () => {
    let response = await request(baseUrl)
      .get(data.endPoints.get_findByStatus)
      .query({ status: data.status.Sold })
      .set("Accept", "application/json");

    expect(response.status).to.be.equal(200);
  });

  it("Get pet by status available using callback", (done) => {
    request(baseUrl)
      .get(data.endPoints.get_findByStatus)
      .query({ status:data.status.Available })
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.be.equal(200)
        done();
      });
  });


  it("Get pet by incorrect status unavailable", async () => {
    const response = await request(baseUrl)
      .get(data.endPoints.get_findByStatus)
      .query({ status: "unavailable" })
      .set("Accept", "application/json");
    expect(response.status).to.be.equal(400);
   
  });

  
  it("Get pet by incorrect route/endpoint ", async () => {
    const response = await request(baseUrl)
      .get("/pet/fin")
      .query({ status: data.status.Available })
      .set("Accept", "application/json");

    expect(response.status).to.be.equal(400);
  });

});
