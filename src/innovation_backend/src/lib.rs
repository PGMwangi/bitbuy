use ic_principal::Principal;

#[ic_cdk::update]
fn whoami() -> Principal {
    ic_cdk::caller()
}

