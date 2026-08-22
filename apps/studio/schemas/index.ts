import {caseStudy} from './caseStudy'
import {homePage} from './homePage'
import {legalPage} from './legalPage'
import {imageWithAlt} from './objects/imageWithAlt'
import {seo} from './objects/seo'
import {serviceItem} from './objects/serviceItem'
import {partner} from './partner'
import {service} from './service'
import {siteSettings} from './siteSettings'
import {teamMember} from './teamMember'

export const schemaTypes = [
  imageWithAlt,
  seo,
  serviceItem,
  siteSettings,
  homePage,
  service,
  caseStudy,
  partner,
  teamMember,
  legalPage,
]

export {
  caseStudy,
  homePage,
  imageWithAlt,
  legalPage,
  partner,
  seo,
  service,
  serviceItem,
  siteSettings,
  teamMember,
}
