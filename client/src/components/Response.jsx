
import Container from 'react-bootstrap/Container'
import { User } from './User'
import { System } from './System'


export const Response = ({conversation, popup}) => {
  console.log('Response component received conversation:', conversation);


  return (
    <>
      <div className='scroll-box'>
        <Container>
          {conversation.map((item, index) =>
            item.role === 'user' ?
              <User key={index} item={item} />
            :
              <System key={index} item={item} popup={popup} />
          )}
        </Container>
      </div>
    </>
  )
}
