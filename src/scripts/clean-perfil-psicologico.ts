import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando limpeza dos perfis psicológicos...')

    const questionarios = await prisma.questionario.findMany({
        where: {
            perfilPsicologico: {
                not: null
            }
        }
    })

    console.log(`Encontrados ${questionarios.length} questionários com perfil`)

    let limpos = 0
    let erros = 0

    for (const q of questionarios) {
        try {
            if (!q.perfilPsicologico) continue

            // Remove backticks e markdown
            let perfilLimpo = q.perfilPsicologico.replace(/```json\s*|```/g, "").trim()

            // Valida se é JSON válido
            let perfilJSON: any
            try {
                perfilJSON = JSON.parse(perfilLimpo)
            } catch {
                console.log(`❌ Questionário ${q.id}: JSON inválido, pulando...`)
                erros++
                continue
            }

            // Garante que tem o campo "tipo"
            if (!perfilJSON.tipo) {
                // Tenta inferir do perfilPrincipal
                const principal = (perfilJSON.perfilPrincipal || '').toLowerCase()
                if (principal.includes('engajado')) perfilJSON.tipo = 'engajado'
                else if (principal.includes('motivado')) perfilJSON.tipo = 'motivado'
                else if (principal.includes('resiliente')) perfilJSON.tipo = 'resiliente'
                else if (principal.includes('estressado')) perfilJSON.tipo = 'estressado'
                else if (principal.includes('burnout')) perfilJSON.tipo = 'burnout'
                else if (principal.includes('desmotivado')) perfilJSON.tipo = 'desmotivado'
                else if (principal.includes('ansioso')) perfilJSON.tipo = 'ansioso'
                else if (principal.includes('confiante')) perfilJSON.tipo = 'confiante'
                else perfilJSON.tipo = 'equilibrado'
            }

            // Salva limpo
            const perfilFinal = JSON.stringify(perfilJSON)

            await prisma.questionario.update({
                where: { id: q.id },
                data: { perfilPsicologico: perfilFinal }
            })

            console.log(`✓ Questionário ${q.id} limpo (tipo: ${perfilJSON.tipo})`)
            limpos++
        } catch (err) {
            console.error(`Erro ao limpar questionário ${q.id}:`, err)
            erros++
        }
    }

    console.log('\n=== Resultado ===')
    console.log(`✓ Limpos: ${limpos}`)
    console.log(`❌ Erros: ${erros}`)
    console.log('Limpeza concluída!')
}

main()
    .catch((e) => {
        console.error('Erro na limpeza:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
