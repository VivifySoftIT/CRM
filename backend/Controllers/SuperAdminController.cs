using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CRM_Management.Data;

namespace CRM_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperAdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuperAdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("organizations")]
        public async Task<IActionResult> GetOrganizations()
        {
            try 
            {
                var admins = await _context.Users
                    .Where(u => u.Role == "Admin")
                    .Select(u => new
                    {
                        id = u.Id,
                        name = u.FullName + " Organization", 
                        admin = u.FullName,
                        plan = "Pro",
                        status = u.IsActive ? "Active" : "Suspended",
                        revenue = "$999",
                        joined = u.CreatedAt.ToString("MMM yyyy")
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = admins });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
