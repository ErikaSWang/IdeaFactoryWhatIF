import Container from 'react-bootstrap/Container'


export const User = ({item}) => {
  const content = item.content;
  
  return (
    <>
        <Container className='d-flex justify-content-right'>
            {content && (
              <div className="analysis-results">
                  <div className="d-flex justify-content-right user-input">
                    {content}
                  </div>
              </div>
            )}
        </Container>
    </>
  )
}
