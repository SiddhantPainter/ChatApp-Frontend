import constants from "./constants";
import axios from "axios";

export const getAuctionMessages = (auctionId) =>
  axios.get(`${constants.API_PATH}/bid-message/${auctionId}`);
