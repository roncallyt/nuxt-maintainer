export interface StorageOptions {
  mount?: string
  keyPrefix?: string
}

export interface ModuleOptions {
  storage?: StorageOptions
  exclude?: string[]
  defaultMessage?: string
  sectionDefaultMessage?: string
}

export interface MaintenanceRecord {
  version: 1
  message: string
  since: string
  retryAfter?: number
  refresh?: number
  secretHash?: string
}

export interface PublicMaintenanceState {
  down: boolean
  message?: string
  since?: string
  retryAfter?: number
  refresh?: number
}

export interface MaintenanceStatus {
  site: PublicMaintenanceState
  sections?: Record<string, PublicMaintenanceState>
  bypassed?: boolean
}
