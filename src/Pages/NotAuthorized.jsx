import React from 'react';

function NotAuthorized(){

    return(
    
        <div id="layoutError">
                    <div id="layoutError_content">
                        <main>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-6">
                                        <div className="text-center mt-4">
                                            <img className="mb-4 img-error" src="assets/img/error-404-monochrome.svg" />
                                            <p className="lead">This requested URL was not found on this server.</p>
                                            <a href="index.html">
                                                <i className="fas fa-arrow-left me-1"></i>
                                                Return to Dashboard
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div id="layoutError_footer">
                        <footer className="py-4 bg-light mt-auto">
                            <div className="container-fluid px-4">
                                <div className="d-flex align-items-center justify-content-between small">
                                    <div className="text-muted">Copyright &copy; Your Website 2023</div>
                                    <div>
                                        <a href="#">Privacy Policy</a>
                                        &middot;
                                        <a href="#">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
    )
}
export default NotAuthorized;
