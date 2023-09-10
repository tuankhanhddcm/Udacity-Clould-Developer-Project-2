import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL,deleteLocalFiles, imageUrlExsits } from './util/util.js';
import { HTPP_STATUS , RESPONSE_MSG} from './util/constant.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */
    app.get("/filteredimage", async (req, res) => {
        const image_url = req.query.image_url;
        if (!image_url) {
          res.status(HTPP_STATUS.BAD_REQUEST).send(RESPONSE_MSG.IMAGE_URL_REQUIRED);
        }
        else if (!await imageUrlExsits(image_url)) {
          res.status(HTPP_STATUS.BAD_REQUEST).send(RESPONSE_MSG.IMAGE_URL_INVALID);
        } 
        else {
          const filteredpath = await filterImageFromURL(image_url.toString());
          res.status(HTPP_STATUS.SUCCESS).sendFile(filteredpath, () => {
            deleteLocalFiles([filteredpath]);
          });
        }
      });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );