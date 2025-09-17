import { PrismaClient } from &apos;@prisma/client&apos;

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { collegeEmail: &apos;admin@college.edu&apos; },
    update: {},
    create: {
      name: &apos;Admin&apos;,
      collegeEmail: &apos;admin@college.edu&apos;,
      role: &apos;ADMIN&apos;,
      phone: &apos;0000000000&apos;
    }
  })

  const manager = await prisma.user.upsert({
    where: { collegeEmail: &apos;manager@college.edu&apos; },
    update: {},
    create: {
      name: &apos;Mess Manager&apos;,
      collegeEmail: &apos;manager@college.edu&apos;,
      role: &apos;MANAGER&apos;,
      phone: &apos;9999999999&apos;
    }
  })

  const student = await prisma.user.upsert({
    where: { collegeEmail: &apos;student@college.edu&apos; },
    update: {},
    create: {
      name: &apos;Student One&apos;,
      collegeEmail: &apos;student@college.edu&apos;,
      role: &apos;STUDENT&apos;,
      phone: &apos;8888888888&apos;
    }
  })

  const mess = await prisma.mess.create({
    data: {
      name: &apos;Main Mess&apos;,
      location: &apos;Block A&apos;,
      managerId: manager.id,
      openHours: &apos;7:00-22:00&apos;
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
        name: &apos;Veg Thali&apos;,
        description: &apos;Rice, Dal, Sabzi, Roti, Salad&apos;,
        ingredients: &apos;Rice, Lentils, Vegetables, Wheat Flour&apos;,
        portionSizes: &apos;small,regular,large&apos;,
        dietTags: &apos;veg&apos;,
        effectiveFrom: date
      }
    })
    
    const nonVegThali = await prisma.menuItem.create({
      data: {
        messId: mess.id,
        name: &apos;Non-Veg Thali&apos;,
        description: &apos;Rice, Dal, Chicken Curry, Roti, Salad&apos;,
        ingredients: &apos;Rice, Lentils, Chicken, Wheat Flour&apos;,
        portionSizes: &apos;small,regular,large&apos;,
        dietTags: &apos;non-veg&apos;,
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
      timeSlot: &apos;lunch&apos;,
      portionSize: &apos;regular&apos;,
      status: &apos;booked&apos;
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


