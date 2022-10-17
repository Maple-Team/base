import https from 'https'

/**
 * 支持的模板文件
 */
export const MANIFEST_URL = 'https://raw.githubusercontent.com/Maple-Team/base/master/packages/templates/manifest.json'

/**
 * 获取某个模板下的文件
 * @param templateName
 * @param path
 * @returns
 */
function templateFileUrl(templateName: string, path: string) {
  return `https://raw.githubusercontent.com/Maple-Team/base/master/packages/templates/templates/${templateName}/${path}`
}

interface SharedTemplateData {
  name: string
  description: string
}

// Data received from the github file
interface RawTemplate extends SharedTemplateData {
  files: string[]
}

interface RawManifest {
  templates: RawTemplate[]
}

// Data returned for the CLI or users to consume
export interface Manifest {
  templates: Template[]
}

export interface Template extends SharedTemplateData {
  files: TemplateFile[]
}

export interface TemplateFile {
  path: string
  url: string
}

/**
 * 获取所有的模板的详细信息
 * @returns
 */
export async function fetchManifest(): Promise<Manifest> {
  /**
   * 使用http请求所有的模板声明
   */
  const rawManifest = await new Promise<RawManifest>((resolve, reject) => {
    https
      .get(MANIFEST_URL, (res) => {
        let json = ''
        res
          .on('data', (chunk) => {
            json += chunk
          })
          .once('end', () => {
            if (res.statusCode === 200) {
              try {
                resolve(JSON.parse(json))
              } catch (e) {
                reject(e)
              }
            } else {
              reject(new Error(`Status: ${res.statusCode}\n${json}`))
            }
          })
          .on('error', (err) => reject(err))
      })
      .on('error', (err) => reject(err))
  })

  const newTemplates: Template[] = rawManifest.templates.map(({ name, description, files }) => {
    return {
      name: name,
      description: description,
      files: files.map((file) => ({
        path: file,
        url: templateFileUrl(name, file),
      })),
    }
  })

  return {
    templates: newTemplates,
  }
}
