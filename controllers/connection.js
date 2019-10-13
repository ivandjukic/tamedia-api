exports.getConnections = async (req, res, next) => {
  const axios = require('axios');
 
  const params = new URLSearchParams();
  params.append('from', req.query.from);
  params.append('to', req.query.to);

  const connectionsResponse = await axios.get('http://transport.opendata.ch/v1/connections', {params});
  const response = {};
  response.to = connectionsResponse.data.to;
  response.from = connectionsResponse.data.from;
  response.connections = connectionsResponse.data.connections.map(connection => {
    return {
      "from": connection.from.station.name,
      "to": connection.to.station.name,
      "steps": connection.sections.map(section => {
        return {
          departure: {
            "time": section.departure.departure,
            "place": section.departure.location.name
          },
          arrival: {
            "time": section.arrival.arrival,
            "place": section.arrival.location.name
          },
          "stations": !section.journey? [] : section.journey.passList.map(visitedStation => {
            return {
              "name": visitedStation.station.name,
              "departure": visitedStation.departure
            }
          }),
          "walk": section.walk && section.walk.duration? section.walk.duration : null,
          "type": section.journey? section.journey.category : 'walk'
        }
      })
    }
  });
  res.status(200).json(response);
};