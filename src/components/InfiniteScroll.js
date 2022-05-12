import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import urlService from "../services/urls";
import * as endpoints from "../endpoints";
import { getBusiness } from "../services/getBusiness";
import { useAuth0 } from "@auth0/auth0-react";
import MediaCard from "./Card";

const LIMIT = 6;

export default function BusinessList() {
  const [braBusList, setBraBusList] = useState([]);
  const [postData, setPostData] = useState([]);
  const [visible, setVisible] = useState(LIMIT);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = React.useState(1);
  const [category, setCategory] = React.useState(0);
  const [searchField, setSearchField] = React.useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [isAPIdataLoading, setAPIdataLoading] = useState(true);
  const { user, isAuthenticated, isLoading } = useAuth0();

  const url = urlService(endpoints.GetBusinessList);

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

  const getBBs = async (page) => {
    setAPIdataLoading(true);
    const list = await getBusiness(url);
    return list;
  };

  useEffect(() => {
    if (!isLoading) {
      const fetchData2 = setTimeout(async () => {
        const [brazilianBusinsessList] = await Promise.all([getBBs(page)]);

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
      loader={<h4>Loading...</h4>}
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
      {postData.map((item, index) => {
        return <MediaCard business={item} key={index} />;
      })}
    </InfiniteScroll>
  );
}
