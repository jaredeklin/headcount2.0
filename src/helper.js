export default class DistrictRepository {
  constructor(stats) {
    this.stats = this.summarizeStats(stats);
  }

  summarizeStats(stats) {
    return stats.reduce((statsObj, enrollment) => {
      if (!statsObj[enrollment.Location]){
        statsObj[enrollment.Location] = { location: '', stats: {}};
      } 

      statsObj[enrollment.Location].location = 
        enrollment.Location.toUpperCase();
      statsObj[enrollment.Location].statType = enrollment.DataFormat;

      if (enrollment.DataFormat === 'Percent') {
        statsObj[enrollment.Location].stats[enrollment.TimeFrame] = 
          this.cleanStats(enrollment.Data, 'Percent');
      } else if (enrollment.DataFormat === 'Number') {
        statsObj[enrollment.Location].stats[enrollment.TimeFrame] = 
          this.cleanStats(enrollment.Data, 'Number');
      }

      return statsObj;
    }, {});
  }

  cleanStats(stats, dataType) {
    if (typeof stats === 'string') {
      stats = 0;
    }

    if (dataType === 'Percent') {
      return parseFloat(stats.toFixed(3));
    } else {
      return stats;
    }
  }

  findByName(name) {
    if (name) {
      var caseInsensitive = name.toUpperCase();  
    }

    const findDistrict = Object.keys(this.stats).find(district => {
      return district.toUpperCase() === caseInsensitive;
    });

    return this.stats[findDistrict];
  }

  findAllMatches(name) {
    let keys = Object.keys(this.stats);

    if (name) {
      return keys.map(key => this.stats[key]).filter(district => 
        district.location.includes(name.toUpperCase()));
    } else {
      return keys.map(key => this.stats[key]);
    }
  }

  findAverage(name) {
    const district = this.findByName(name);
    const percentagesList = Object.values(district.stats);
    const sum = percentagesList.reduce((sum, percentage) => 
      sum + percentage, 0);
    return parseFloat((sum / percentagesList.length).toFixed(3));
  }

  compareDistrictAverages(district1name, district2name) {
    const district1average = this.findAverage(district1name);
    const district2average = this.findAverage(district2name);
    const compared = 
      parseFloat((district1average / district2average).toFixed(3));
    return {
      [district1name.toUpperCase()]: district1average,
      [district2name.toUpperCase()]: district2average,
      compared
    };
    
  }
}
