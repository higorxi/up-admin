/**
 * Cliente para comunicação com a API externa
 */

type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string>
  body?: any
  cache?: RequestCache
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  // Método para adicionar token de autenticação
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  // Método para remover token de autenticação
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"]
  }

  // Método para construir a URL com parâmetros de consulta
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  // Método genérico para fazer requisições
  private async request<T>(method: string, endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, body, cache } = options

    const url = this.buildUrl(endpoint, params)

    const requestOptions: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      cache,
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    try {
      console.log("URL final:", url)
      console.log('requestOptions', requestOptions)
      const response = await fetch(url, requestOptions)
      console.log('error', response)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro na requisição: ${response.status}`)
      }

      // Para requisições que não retornam JSON (como DELETE)
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      console.error("Erro na requisição API:", error)
      throw error
    }
  }

  // Métodos para cada tipo de requisição HTTP
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", endpoint, options)
  }

  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("POST", endpoint, { ...options, body: data })
  }

  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PUT", endpoint, { ...options, body: data })
  }

  async patch<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PATCH", endpoint, { ...options, body: data })
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("DELETE", endpoint, options)
  }
}

// Exporta uma instância configurada do cliente API
// Substitua a URL base pela URL da sua API
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002")

export default ApiClient
