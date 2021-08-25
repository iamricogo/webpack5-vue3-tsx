import service, { Response, ResponseInstance } from '@/utils/Service'

export interface SubmitData {
  name: string
  email: string
  mobile_number: string
  comment: string
}

export interface ProvinceData {
  cityAdcode: number
  cityCitycode: string
  cityLeve: number
  cityName: string
  cityParent: number
  cityParentAdcode: number
  cityPy: string
  cityVisble: number
}

export type SubmitResponse = Response

export type GetProvinceListResponse = Response<ProvinceData[]>

class Service {
  static submit(data: SubmitData): ResponseInstance<SubmitResponse> {
    return service.post('/abc', data)
  }

  static getProvinceList(): ResponseInstance<GetProvinceListResponse> {
    return service.get('/common/provinceList')
  }
}

export default Service
