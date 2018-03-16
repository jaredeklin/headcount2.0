import React, { Component } from 'react';
import './styles/App.css';
import DistrictRepository from './helper';
import kinderData from './data/kindergartners_in_full_day_program.js';
import { CardContainer } from './CardContainer';
import Search from './Search';
import ComparisonContainer from './ComparisonContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      data: [],
      selectedCards: []
    };
    this.district = '';
    this.comparison = '';
  }

  getData = (newData) => {
    this.district = new DistrictRepository(newData);
    const data = this.district.findAllMatches()
    this.setState({
      data
    })
  }

  filterData = (userInput) => {
    const matchedData = this.district.findAllMatches(userInput)
    this.setState({data: matchedData})
  }

  componentDidMount() {
    this.getData(kinderData)
  }

  selectCard = (card) => {
    let clickedCards = [...this.state.selectedCards];

    if(card.className.includes("clicked")) {
      this.state.selectedCards.forEach((selectedCard, index) => {
        card.location === selectedCard.location && clickedCards.splice(index, 1);
      });
    } else {
      clickedCards.length < 2 ? clickedCards.push(card) : clickedCards[1] = card;
    }
    this.setState({ selectedCards: clickedCards })
    this.comparison = clickedCards.length === 2 ? this.district.compareDistrictAverages(clickedCards[0].location, clickedCards[1].location) : '';
  }
  // oldSelectCard = (card) => {
  //   const clickedCards = [...this.state.selectedCards ]
  //   { clickedCards.length < 2 ? clickedCards.push(card) : clickedCards[1] = card }
  //   this.setState({selectedCards: clickedCards})
  //   if(clickedCards.length === 2) {
  //     this.compareCards(clickedCards[0].location, clickedCards[1].location)
  //   }
  // }

  // deselectCard = (card) => {
  //   let clickedCards = [...this.state.selectedCards]
  //   this.state.selectedCards.forEach( (selectedCard, index) => {
  //     if(card.location === selectedCard.location) {
  //       clickedCards.splice(index, 1)
  //     }
  //   });
  //   this.setState({selectedCards: clickedCards})
  // }

  // compareCards = (district1, district2) => {
  //   this.comparison = this.district.compareDistrictAverages(district1, district2)
  // }

  render() {
    return (
      <div>
        <header>
          <h1>Welcome To Headcount 2.0</h1>
          <Search filterData={this.filterData}/>
        </header>
        {
          this.state.selectedCards.length > 0 && 
            <ComparisonContainer  selectedCards={this.state.selectedCards} 
                                  selectCard={this.selectCard} 
                                  deselectCard={this.deselectCard} 
                                  comparison={this.comparison} 
            />
        }
        <CardContainer  data={this.state.data} 
                        selectCard={this.selectCard}
                        deselectCard={this.deselectCard} 
                        selectedCards={this.state.selectedCards} 
        />
      </div>

    );
  }
}

export default App;
