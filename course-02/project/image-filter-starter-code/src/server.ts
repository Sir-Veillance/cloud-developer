import express, {Express, Router, Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port: any = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    let {image_url} = req.query;
    let stringUrl = String(image_url);

    if (!image_url) {
      return res.status(400).send("URL parameter required");
    } else {
      try {
        let validation: URL = new URL(stringUrl);
        const imagePath: string = await filterImageFromURL(stringUrl);

        res.sendFile(imagePath, err => {
          if (err) {
            console.log(err);
            deleteLocalFiles([imagePath]);
            res.status(500);
          } else {
            deleteLocalFiles([imagePath]);
          }
        });
      } catch (err) {
        return res.status(400).send("URL is not valid");
      }
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
