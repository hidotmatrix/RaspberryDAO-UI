import React from 'react'
import Card from './Card';

export default function CardList(props) {
    const {proposalDataArray,provider} = props;
  return (
    <div>
        {proposalDataArray.map((data, index) => {
            return (
                <div key={index}>
                   <Card data={data} index={index} provider={provider}/>
                </div> 
            )
        })}
    </div>
  )
}
