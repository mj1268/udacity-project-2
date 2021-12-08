import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidUrl} from './util/util';

(async () => {

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

  //! END @TODO1
  app.get( "/filteredimage", async (req, res) => {
    try {
      // Get submitted image url
      const img_url: string = req.query.image_url

      // Check if this is a valid url
      const isValid = isValidUrl(img_url)
      if (!isValid) {
        res.statusMessage = "Provided url is not a valid image"
        res.status(422).send()
      }
  
      // Filter the image and save as a temporary file
      const filteredImagePath = await filterImageFromURL(img_url)
  
      // Send new file
      res.sendFile(filteredImagePath, (err) => {
        // Delete temporary files
        deleteLocalFiles([filteredImagePath])
      })
  
    } catch (e) {
      console.log(e)
      res.statusMessage = "Unknown server error occurred while processing image"
      res.status(500).send()
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();