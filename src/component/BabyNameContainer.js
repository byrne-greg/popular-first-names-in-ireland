// Requirements
// SUMMARY: Manage the state and pass modifier functions to child elements

import React, { Component } from "react";
import api from "../api/api";
import BabyNameFilter from "./BabyNameFilter";
import BabyNameDetails from "./BabyNameDetails";
import LoadableBabyNameList from "./BabyNameList";

class BabyNameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boysNamesLoaded: false,
      girlsNamesLoaded: false,
      names: [],
      filteredNames: [],
      selectedName: null
    };

    this.setSelectedName = this.setSelectedName.bind(this);
    this.unfilterNames = this.unfilterNames.bind(this);
    this.filterNamesByGender = this.filterNamesByGender.bind(this);
    this.filterNamesByApproximation = this.filterNamesByApproximation.bind(
      this
    );
  }

  componentDidMount() {
    api.fetchBoysNames().then(result =>
      this.setState({
        names: [...this.state.names, ...result],
        filteredNames: [...this.state.names, ...result],
        boysNamesLoaded: true
      })
    );
    api.fetchGirlsNames().then(result =>
      this.setState({
        names: [...this.state.names, ...result],
        filteredNames: [...this.state.names, ...result],
        girlsNamesLoaded: true
      })
    );
  }

  setSelectedName(selectedName) {
    this.setState({ selectedName });
  }

  getNameDetailFromList(name) {
    const filteredNames = this.state.names.filter(
      nameObj => nameObj.name === name
    );
    return filteredNames[0];
  }

  filterNamesByApproximation(name) {
    const filteredNames = this.state.names.filter(nameObj =>
      nameObj.name.toLowerCase().includes(name.toLowerCase())
    );
    this.setState({
      filteredNames
    });
  }

  filterNamesByGender(gender) {
    const filteredNames = this.state.names.filter(
      nameObj => nameObj.genderedName === gender
    );
    this.setState({
      filteredNames
    });
  }

  unfilterNames() {
    this.setState({ filteredNames: [...this.state.names] });
  }

  render() {
    const allNamesLoaded =
      this.state.girlsNamesLoaded && this.state.boysNamesLoaded;
    return (
      <div className="BabyNameContainer">
        <BabyNameFilter
          handleGenderedNameFilter={this.filterNamesByGender}
          handleShowAllFilter={this.unfilterNames}
          handleApproximationFilter={this.filterNamesByApproximation}
        />
        {this.state.selectedName === null || this.state.selectedName === "" ? (
          <LoadableBabyNameList
            loading={!allNamesLoaded}
            nameList={this.state.filteredNames}
            handleRowClick={this.setSelectedName}
          />
        ) : null}

        {this.state.selectedName !== null && allNamesLoaded ? (
          <BabyNameDetails
            nameDetails={this.getNameDetailFromList(this.state.selectedName)}
            handleClose={() => this.setSelectedName(null)}
          />
        ) : null}
      </div>
    );
  }
}

export default BabyNameContainer;
