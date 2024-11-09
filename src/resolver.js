const resolvers = {
    Query: {
        getGame: async (_, { id }, { dataSources }) => {
        // Assume you have a data source or database connection available
        return dataSources.gameAPI.getGameById(id);
      },
    },
  };
  
  module.exports = resolvers;