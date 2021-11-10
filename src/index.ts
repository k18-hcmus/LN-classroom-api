import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';


// Start the server
const port = Number(process.env.PORT || 8081);
const host = process.env.HOST || 'http://localhost'
app.listen(port, () => {
    logger.info(`Express server started on port: ${host}:${port}`);
});
