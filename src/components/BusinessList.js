import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import urlService from "../services/urls";
import * as endpoints from "../endpoints";
import { getBusiness } from "../services/getBusiness";
import { useAuth0 } from "@auth0/auth0-react";
import MediaCard from "./Card";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const LIMIT = 6;

export default function BusinessList({
  category,
  searchField
}) {
  const [braBusList, setBraBusList] = useState([]);
  const [postData, setPostData] = useState([]);
  const [visible, setVisible] = useState(LIMIT);
  const [hasMore, setHasMore] = useState(true);

  const [filteredList, setFilteredList] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth0();

  const url = urlService(endpoints.GetBusiness);

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

  const getBBs = async () => {
    setAPIdataLoading(true);
    let getURL = category === 0 ? url : `${url}/${category}`;
    const list = await getBusiness(getURL);
    return list;
  };

  useEffect(() => {
    let brazilianBusinsessList = []
    if (!isLoading) {
      const fetchData2 = setTimeout(async () => {
        brazilianBusinsessList = await getBBs();

        // TODO ADD ERROR HANDLING
        if (!brazilianBusinsessList) {
          return 
        }

        if(searchField !== '') {
          brazilianBusinsessList = braBusList.filter(bus => {
            return bus.name.toLowerCase().includes(searchField.toLowerCase())
          })
        }

        setBraBusList(brazilianBusinsessList);
        setPostData(brazilianBusinsessList.slice(0, LIMIT));
        setAPIdataLoading(false);
        return brazilianBusinsessList;
      }, 2500);

      return () => clearTimeout(fetchData);
    }
  }, [isLoading, category, searchField]);

  return (
    <InfiniteScroll
      dataLength={postData.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      refreshFunction={fetchData}
      pullDownToRefresh
      pullDownToRefreshThreshold={7}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
      }
    >
      <Container maxWidth="lg" style={{ marginTop: "30px" }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={4}>
            {postData.map((card, index) => {
              return (
                <Grid item>
                  <MediaCard business={card} key={index} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </InfiniteScroll>
  );
}
