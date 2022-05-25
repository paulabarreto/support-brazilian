import React, { useState, useEffect } from "react";
import MediaCard from "./Card";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

export default function BusinessList({ brazilianBusinessList }) {
  return (
    <Container maxWidth="lg" style={{ marginTop: "30px" }}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={4}>
          {brazilianBusinessList.map((card, index) => {
            return (
              <Grid item>
                <MediaCard business={card} key={index} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
}
