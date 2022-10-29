import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import urlService from "../services/urls";
import * as endpoints from "../endpoints";
import { getBusiness, getFavouritesList } from "../services/getBusiness";
import { useAuth0 } from "@auth0/auth0-react";
import MediaCard from "./Card";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const LIMIT = 6;

export default function BusinessListInfiniteLoad({
  brazilianBusinessList,
  isAdmin
}) {
  const [braBusList, setBraBusList] = useState([]);
  const [postData, setPostData] = useState([]);
  const [visible, setVisible] = useState(LIMIT);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = () => {

    const newLimit = visible + LIMIT;
    const dataToAdd = braBusList.slice(visible, newLimit);
    if (braBusList.length > postData.length) {
      setPostData([...postData].concat(dataToAdd));
      setVisible(newLimit);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setBraBusList(brazilianBusinessList)
    setPostData(brazilianBusinessList.slice(0, LIMIT))
  }, [brazilianBusinessList]);

  return (
    <InfiniteScroll
      dataLength={postData.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      style={{ overflow: 'visible' }}
      refreshFunction={fetchData}
      pullDownToRefresh
      pullDownToRefreshThreshold={7}
    >
      <Container maxWidth="lg" style={{ marginTop: "30px" }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={4}>
            {postData.map((card, index) => {
              return (
                <Grid item>
                  <MediaCard isAdmin={isAdmin} business={card} key={index} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </InfiniteScroll>
  );
}
