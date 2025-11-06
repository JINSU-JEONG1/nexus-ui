import useJwt from '@/auth/jwt/useJwt'
import store from '@/store';

const service = useJwt;

export default function request(...arg){
    //console.debug(service.axiosIns);

    //추가적인 파라미터 처리
    const logRouteChange = store.state.erns.logRouteChange || {
        from : null,
        to : null
      };
    const currentLogRoute = logRouteChange.to || {};
    const compid = "1200"; //TODO : 추후 법인코드 처리시 변경
    const {data} = arg[0];
    if(data){
        data["compid"] = compid;
        data["routerName"] = currentLogRoute.name;
    }
    
    return service.axiosIns(...arg);
}

