import Spinner from 'react-bootstrap/Spinner';

const LoadSpinners = () => {
    return( 
      <>
          <div className='position-fixed z-5 w-100 h-100 top-0 start-0 d-flex justify-content-center align-items-center '
          style={{cursor: "progress",backgroundColor: "rgba(0,0,0,0.1)", zIndex: "1050"  }}
          >
              <Spinner animation="border" variant="primary"  />
          </div>
      </>
    
    )
  }
  
export default LoadSpinners   