import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { collegeEmail: 'admin@college.edu' },
    update: {},
    create: {
      name: 'Admin',
      collegeEmail: 'admin@college.edu',
      role: 'ADMIN',
      phone: '0000000000'
    }
  })

  const manager = await prisma.user.upsert({
    where: { collegeEmail: 'manager@college.edu' },
    update: {},
    create: {
      name: 'Mess Manager',
      collegeEmail: 'manager@college.edu',
      role: 'MANAGER',
      phone: '9999999999'
    }
  })

  const student = await prisma.user.upsert({
    where: { collegeEmail: 'student@college.edu' },
    update: {},
    create: {
      name: 'Student One',
      collegeEmail: 'student@college.edu',
      role: 'STUDENT',
      phone: '8888888888'
    }
  })

  const mess = await prisma.mess.create({
    data: {
      name: 'Main Mess',
      location: 'Block A',
      managerId: manager.id,
      openHours: '7:00-22:00'
    }
  })

  // Create menu items for the next 7 days
  const menuItems = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    const vegThali = await prisma.menuItem.create({
      data: {
        messId: mess.id,
        name: 'Veg Thali',
        description: 'Rice, Dal, Sabzi, Roti, Salad',
        ingredients: 'Rice, Lentils, Vegetables, Wheat Flour',
        portionSizes: 'small,regular,large',
        dietTags: 'veg',
        effectiveFrom: date
      }
    })
    
    const nonVegThali = await prisma.menuItem.create({
      data: {
        messId: mess.id,
        name: 'Non-Veg Thali',
        description: 'Rice, Dal, Chicken Curry, Roti, Salad',
        ingredients: 'Rice, Lentils, Chicken, Wheat Flour',
        portionSizes: 'small,regular,large',
        dietTags: 'non-veg',
        effectiveFrom: date
      }
    })
    
    menuItems.push(vegThali, nonVegThali)
  }

  const item = menuItems[0] // Use first item for booking

  await prisma.booking.create({
    data: {
      userId: student.id,
      messId: mess.id,
      menuItemId: item.id,
      date: new Date(),
      timeSlot: 'lunch',
      portionSize: 'regular',
      status: 'booked'
    }
  })

  console.log({
    admin: admin.id,
    manager: manager.id,
    student: student.id,
    mess: mess.id,
    menuItems: menuItems.map(item => ({ id: item.id, name: item.name, effectiveFrom: item.effectiveFrom }))
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


